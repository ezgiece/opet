import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator';
import Vue from 'vue'
import { isDebuggerStatement } from 'typescript';

declare const $: any;

export class ExpressionBuilderObjectClass implements ExpressionBuilderOption {
  variables: Array<ExpressionBuilderVariable>;
  constructor() {
    this.variables = new Array<ExpressionBuilderVariable>();
  }
  suggestions: 'up' | 'down' = 'up';
  expression: string = '';
  functions: any;
  preventWrongInput: boolean = false;
  isChange: boolean = false;
}

export interface ExpressionBuilderVariable {
  variableId: string;
  name: string;
  value?: any;
}

interface HTMLElement {
  selectionStart: any;
  setSelectionRange: any;
}

export interface ExpressionBuilderOption {
  suggestions: 'up' | 'down';
  expression: string;
  variables: Array<ExpressionBuilderVariable>;
  functions: any;
  preventWrongInput: boolean;
  isChange: boolean;
}

interface ExpressionBuilder {
  getExpression(): string;
  setExpression(expression: string): void;
  isValid(): boolean;
  parseExpression(expression: string): string;
  getInput(): string;
  getVariableById(variableId: number): string;
  setVariables(vars: Array<ExpressionBuilderVariable>): void;
  runExpression(): any;
}

@Component({
  components: {},
  props: {
    refId: String,
    expressionBuilderObject: Object,
    formulaOptions: ExpressionBuilderObjectClass
  }

})

export default class FormulaInputComponent extends Vue {
  constructor() {
    super();
  }

  @Prop()
  formulaOptions: ExpressionBuilderOption = new ExpressionBuilderObjectClass();


  updateExpressionOptions(value: ExpressionBuilderOption) {
    this.formulaOptions = value;
    this.expres = this.expressionBuilder();
    this.$emit('update:expressionBuilderObject', this.expres);
  }
  expres: any = null;
  mounted() {
    this.expres = this.expressionBuilder();
    this.$emit('update:expressionBuilderObject', this.expres);

  }

  expressionBuilder(): ExpressionBuilder {

    const that = this;
    interface ParserOption {
      funcs?: any;
      variables?: Array<ExpressionBuilderVariable>;
    }

    const parser = function (expression: string, options: ParserOption) {
      const defaults: ParserOption = {
        funcs: {},
        variables: []
      };
      options = $.extend({}, defaults, options);

      // abstract base-class
      abstract class GraphNode {
        abstract compute(): any;
        abstract toString(parseVariables?: boolean): string;
      }

      // leaf-nodes
      class ValueNode extends GraphNode {
        value: number | string | Array<GraphNode>;

        public getNumberValue(): number {
          return parseInt(this.value.toString());
        }

        public getStringValue(): string {
          return this.value.toString();
        }

        public getArrayValue(): Array<GraphNode> {
          return this.value as Array<GraphNode>;
        }

        constructor(value: number | string | Array<GraphNode>) {
          super();
          this.value = value;
        }
        compute() { return this.value; }
        toString(parseVariables: boolean = false) {
          if (this.value instanceof Array)
            return this.value
              .filter(v => !(v instanceof CommaNode))
              .map(v => v.toString(true))
              .join(',');

          if (typeof this.value === 'string')
            return `'${this.value}'`;

          return this.value.toString();
        }
      }

      class CommaNode extends GraphNode {
        compute() {
          return ',';
        }
        toString(parseVariables?: boolean): string {
          return ',';
        }

      }

      class PropertyNode extends GraphNode {
        public property: any;
        public inBrackets: boolean;

        constructor(property, inBrackets: boolean = false) {
          super();
          this.property = property;
          this.inBrackets = inBrackets;
        }
        compute() {

          let variable;

          for (let i = 0; i < that.formulaOptions.variables.length; i++) {
            const v = that.formulaOptions.variables[i];
            if (v.name === this.property) {
              variable = v;
              break;
            }
          }

          if (variable === undefined) {
            throw new Error('Property ' + this.property + ' is not defined!');
          }

          return variable.value || variable.variableId;
        }
        toString(parseVariables: boolean = false) {
          if (parseVariables)
            for (let i = 0; i < that.formulaOptions.variables.length; i++) {
              const v = that.formulaOptions.variables[i];
              if (v.name === this.property)
                return `[${v.variableId}]`;
            }
          return String(this.property);
        }
      }

      // tree-nodes
      class FuncNode extends GraphNode {
        public node: GraphNode;
        public name: string;

        constructor(name, node: GraphNode) {
          if (!(node instanceof GraphNode)) {
            throw new Error('invalid node passed');
          }
          super();
          this.name = name;
          this.node = node;
        }
        compute() {
          const v = this.node.compute();

          const vars = v instanceof Array ? v : [v];

          const computes = vars
            .filter(v => v !== ',') // remove ,
            .map(v => v instanceof GraphNode ? (v as GraphNode).compute() : v); // compute each one

          const func = options.funcs[this.name] as Function;

          return func.apply(func, computes);
        }
        toString(parseVariables: boolean = false) {
          return this.name + '(' + this.node.toString(parseVariables) + ')';
        }
      }

      class BinaryNode extends GraphNode {
        static operators: Array<string> = ['*', '/', '+', '-'];
        public op: string;
        public left: GraphNode;
        public right: GraphNode;

        constructor(op: string, left: GraphNode, right: GraphNode) {
          if (!(left instanceof GraphNode && right instanceof GraphNode)) {
            throw new Error('invalid node passed');
          }
          super();
          this.op = op;
          this.left = left;
          this.right = right;
        }
        compute() {
          const l = this.left.compute();
          const r = this.right.compute();
          switch (this.op) {
            // computational operators
            case '+': {return l + r; }
            case '-': {return l - r; }
            case '*': {return l * r; }
            case '/': {return l / r; }
          }
          throw new Error('operator not implemented ' + this.op + '');
        }

        toString(parseVariables: boolean = false) {
          return '(' + this.left.toString(parseVariables) + ')' + this.op + '(' + this.right.toString(parseVariables) + ')';
        }
      }

      function parse(str): GraphNode {
        function extractTokens(exp: string): Array<any> {
          // dynamically build my parsing regex:
          const tokenParser = new RegExp([
            // properties
            /\[[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ$_]*\]+/.source,

            // numbers
            /\d+(?:\.\d*)?|\.\d+/.source,

            // string-literal
            /["](?:\\[\s\S]|[^"])+["]|['](?:\\[\s\S]|[^'])+[']/.source,

            // booleans
            // "true|false",
            // operators
            ['(', ')'].concat(BinaryNode.operators)
              .map(str => String(str).replace(/[.*+?^=!:${}()|[\]/\\]/g, '\\$&'))
              .join('|'),


            // properties
            // has to be after the operators
            /[a-zA-ZğüşöçıİĞÜŞÖÇ$_\s][a-zA-Z0-9ğüşöçıİĞÜŞÖÇ$_\s]*/.source,

            // remaining (non-whitespace-)chars, just in case
            // has to be at the end
            /\S/.source
          ].map(s => '(' + s + ')').join('|'), 'g');

          const _tokens: Array<any> = [];
          // abusing str.replace() as a RegExp.forEach
          exp.replace(tokenParser, function (token, prop, num, str, op, property): string {
            let t: any;
            t = token;

            if (num)
              t = new ValueNode(+num);
            else if (str) {
              str = str.substr(1, str.length - 2);
              str = str.replace(/"/g, '\'');
              t = new ValueNode(JSON.parse('"' + str + '"'));
            }
            else if (property)
              t = new PropertyNode(property);
            else if (prop)
              t = new PropertyNode(prop.substring(1, prop.length - 1), true);
            else if (token === ',')
              t = new CommaNode();
            else if (!op)
              throw new Error('unexpected token ' + token + '');

            _tokens.push(t);

            return '';
          });

          return _tokens;
        }

        function handleNegativenumbers(tokens: Array<any>): Array<any> {
          // detect negative numbers
          if (tokens[0] === '-' && tokens[1] instanceof ValueNode) {
            (tokens[1] as ValueNode).value = -1 * (tokens[1] as ValueNode).getNumberValue();
            tokens.splice(0, 1);
          }

          for (let i = 0; i < tokens.length; i++) {
            if (['(', ',', '/', '*'].indexOf(tokens[i]) > -1 && tokens[i + 1] === '-' && tokens[i + 2] instanceof ValueNode) {

              (tokens[i + 2] as ValueNode).value = (tokens[i + 2] as ValueNode).getNumberValue() * -1;
              tokens.splice(i + 1, 1);
            }
          }
          // end detect negative numbers

          return tokens;
        }

        function wrapParenteses(tokens: Array<any>): GraphNode {

          function process(tokens: Array<any>): GraphNode {
            BinaryNode.operators.forEach(token => {
              for (let i = 1; (i = tokens.indexOf(token, i - 1)) > -1;) {
                tokens.splice(i - 1, 3, new BinaryNode(token, tokens[i - 1], tokens[i + 1]));
              }
            });

            let hasComma = false;
            for (let j = 0; j < tokens.length; j++) {
              if (tokens[j] instanceof CommaNode) {
                hasComma = true;
                break;
              }
            }

            if (hasComma) {

              const commaCount = tokens.filter(t => t === ',').length;
              const argCount = commaCount * 2 + 1;

              if (tokens.length !== argCount)
                throw new Error('Syntax error for the arguments: ' + tokens.filter(t => !(t instanceof CommaNode)).join(','));

              tokens = [new ValueNode(tokens)];
            }

            if (tokens.length !== 1) {
              throw new Error('Something went wrong');
            }
            return tokens[0];
          }

          // wrap inside any parentheses
          for (let i: number, j; (i = tokens.lastIndexOf('(')) > -1 && (j = tokens.indexOf(')', i)) > -1;) {

            // if before parentheses there is a property which means it is a function
            if (tokens[i - 1] instanceof PropertyNode && !(tokens[i - 1] as PropertyNode).inBrackets) {
              const op = tokens[i - 1].toString();

              const funcParam = i + 1 === j ? new ValueNode([]) : process(tokens.slice(i + 1, j));

              let varsLength = 1;

              if (funcParam instanceof ValueNode && funcParam.value instanceof Array)
                varsLength = funcParam.value.filter(v => !(v instanceof CommaNode)).length; // remove

              const func = options.funcs[op] as Function;
              if (!func) {
                throw new Error(op + ' is not defined.');
              }

              if (varsLength !== func.length)
                throw new Error(op + ' requires ' + func.length + ' argument(s)');

              const funcNode = new FuncNode(op, funcParam);
              tokens.splice(i - 1, j + 2 - i, funcNode);
            }
            else
              tokens.splice(i, j + 1 - i, process(tokens.slice(i + 1, j)));
          }

          if (~tokens.indexOf('(') || ~tokens.indexOf(')')) {
            throw new Error('Mismatching brackets');
          }

          return process(tokens);
        }

        let expTokens = extractTokens(str);

        expTokens = handleNegativenumbers(expTokens);

        return wrapParenteses(expTokens);
      }

      return {
        getExpressionTree: function () {
          try {
            return parse(expression);
          } catch (e) {
            return undefined;
          }
        },
        runExpressionTree: function () {
          try {
            const tree = parse(expression);
            return tree.compute();
          } catch (e) {
            return undefined;
          }
        },
        validate: function () {
          let result = '';
          try {
            parse(expression).compute();
          } catch (e) {
            result = e.message;
          }

          return result;
        }
      };
    };

    if (!that.formulaOptions)
      that.formulaOptions = new ExpressionBuilderObjectClass();

    if (!that.formulaOptions.suggestions)
      that.formulaOptions.suggestions = 'down';

    if (!that.formulaOptions.expression)
      that.formulaOptions.expression = '';

    if (that.formulaOptions.preventWrongInput === undefined)
      that.formulaOptions.preventWrongInput = false;

    const expressionInput = <any>$(this.$refs.refId);
    let inVariable = false;
    let inString = false;
    let isPaste = false;
    let parserOptions: ParserOption = {
      funcs: {},
      variables: []
    };
    let suggestions,
      notificaiton, lastText = '';

    // Initial for the first time
    initial();

    // set value
    if (that.formulaOptions.expression !== '')
      setExpresionToInput(that.formulaOptions.expression);

    function initial() {
      if (!expressionInput.attr('exp-id')) {

        const id = new Date().getTime();
        suggestions = $('<div class="exp-suggestions" ' + that.formulaOptions.suggestions + '" exp-id="' + id + '" style="position:relative" ></div>"');
        notificaiton = $('<div class="exp-notification" data-toogle="tooltip" data-placement="top" exp-id=' + id +
          '"><span class="glyphicon glyphicon-ok ok fa fa-check"></span><span class="glyphicon glyphicon-remove error fa fa-times"></span></div>');

        expressionInput.attr('exp-id', id);

        expressionInput.data('variables', that.formulaOptions.variables);

        that.formulaOptions.functions = that.formulaOptions.functions || [];
        expressionInput.data('funcs', that.formulaOptions.functions);

        const parent = $('<div class="exp-container" exp-id=' + id + '"></div>"');

        expressionInput.parent().append(parent);

        parent
          .append(expressionInput)
          .append(suggestions)
          .append(notificaiton);

        expressionInput.on('input', onInput);
        expressionInput.keydown(onKeydown);
        expressionInput.on('paste', onPaste);

        suggestions.on('click', '.exp-suggestion-item', function (e: JQuery.Event) {
          selectVariable($(this));
          e.stopPropagation();
        });

        $('body').click(hideSuggestions);
        expressionInput.click(function (e) { e.stopPropagation(); });
      }
      else {
        const id = expressionInput.attr('exp-id');
        suggestions = $('.exp-container .exp-suggestions[exp-id=' + id + ']');
        notificaiton = $('.exp-container .exp-notification[exp-id=' + id + ']');

        if (!that.formulaOptions.variables)
          that.formulaOptions.variables = expressionInput.data('variables');

        if (!that.formulaOptions.functions)
          that.formulaOptions.functions = expressionInput.data('funcs');
      }

      parserOptions = {
        funcs: that.formulaOptions.functions,
        variables: that.formulaOptions.variables
      };
    }

    function onPaste() {
      isPaste = true;
      setTimeout(function () { isPaste = false; validation(); }, 100);
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        hideSuggestions();
        return false;
      }

      if (that.formulaOptions.preventWrongInput && !inVariable)
        return;

      if (['Up', 'Down', 'ArrowUp', 'ArrowDown'].indexOf(e.key) > -1)  {
        let index = parseInt(suggestions.attr('data-index'));
        const divs = suggestions.find('div.exp-suggestion-item');
        const   isUp = e.key === 'Up' || e.key === 'ArrowUp';

        if (divs.length === 0){
          return;

        }

        if (isUp && index === -1 || !isUp && divs.length === index + 1)
          return;

        index = isUp ? index - 1 : index + 1;


        suggestions.attr('data-index', index);
        divs.removeClass('selected');

        // set scroll
        const height = suggestions.height(),
          divItem = $(divs.get(index)),
          itemHeight = divItem.height() || 0,
          itemTop = divItem.position().top,
          itemBottom = itemTop + itemHeight,
          scrollTop = suggestions.scrollTop(),
          scrollBottom = height + scrollTop;

        divItem.addClass('selected');

        if (itemTop < scrollTop)
          suggestions.scrollTop(itemTop);

        if (itemBottom > scrollBottom)
          suggestions.scrollTop(itemTop - height + itemHeight + 5);

        return;
      }

      if (e.key === 'Enter') {
        selectVariable(suggestions.find('.exp-suggestion-item.selected'));
        return;
      }

    }

    function onInput(e) {


      // accept the input character and validate the expression
      function returnAcceptedInput(val) {
        lastText = val;
        validation();
      }

      // if the expression is ready to accpet new entry (variable, date or string)
      function acceptNewEntry(lastChar) {
        if (lastText === '')
          return true;

        if (inVariable || inString)
          return false;

        return isOperator(lastChar) || lastChar === '(';
      }

      function setLastText(cur) {
        expressionInput.addClass('in-valid-char');
        expressionInput.val(lastText);
        setCursorPosition(--cur);
        setTimeout(function () { expressionInput.removeClass('in-valid-char'); }, 100);
      }

      function forceCharInput(val, cursor, input) {

        let lastChar = '',
          hasSpace = false,
          _inVariable = false,
          _inString = false;

        if (isPaste) {
          isPaste = false;
          return returnAcceptedInput(val);
        }

        if (input === '\b')
          lastChar = lastText[cursor];
        else {
          let lastCharLocation = cursor - 2;
          lastChar = val[lastCharLocation] || '';

          hasSpace = lastChar === ' ';

          while (lastChar === ' ') {
            lastChar = val[--lastCharLocation] || '';
          }
        }

        // changes in the middle
        for (let i = 0; i < cursor - 1; i++) {
          if (!_inString && val[i] === '"') {
            _inString = true;
            continue;
          }

          if (_inString) {
            if (val[i] === '"')
              _inString = false;

            continue;
          }

          if (!_inString && val[i] === '[') {
            _inVariable = true;
            continue;
          }

          if (!_inString && val[i] === ']') {
            _inVariable = false;
            continue;
          }
        }

        inString = _inString;
        inVariable = _inVariable;

        if (inString) {
          if (input === '"')
            inString = false;

          return returnAcceptedInput(val);
        }

        if (isInvalidCharacter(input))
          return setLastText(cursor);

        if (input === '"') {
          if (!acceptNewEntry(lastChar))
            return setLastText(cursor);

          inString = true;
        }

        //  Prevent multiple spaces
        if (input === ' ' && hasSpace)
          return setLastText(cursor);

        if (input === '-') {
          //  handle negative numbers
          if (lastText === '' ||
            ['(', '*', '/'].indexOf(lastChar) > -1) {
            return returnAcceptedInput(val);
          }
        }

        if (isOperator(input)) {
          if (lastText === '' ||
            isOperator(lastChar) ||
            ['[', '('].indexOf(lastChar) > -1)
            return setLastText(cursor);
        }

        if (input === ')')
          if (isOperator(lastChar) || lastText === '' || lastChar === '[')
            return setLastText(cursor);

        if (input === '(' && lastText !== '')
          if (!isOperator(lastChar) && lastChar !== '(' && lastChar !== '')
            return setLastText(cursor);

        if (input === '[') {
          if (lastText !== '') {
            if ([']', '[', ')'].indexOf(lastChar) > -1)
              return setLastText(cursor);

            if (!isOperator(lastChar) && lastChar !== '(' && lastChar !== '')
              return setLastText(cursor);
          }

          inVariable = true;
          showSuggestions(val, cursor);
        }

        if (input === ']') {
          if (lastText === '' || isOperator(lastChar) || [']', '[', ')', '('].indexOf(lastChar) > -1)
            return setLastText(cursor);

          if (!inVariable)
            return setLastText(cursor);

          inVariable = false;
          hideSuggestions();
        }

        if (isVariableCharacter(input)) {
          if (lastText !== '' &&
            !isOperator(lastChar) &&
            ['(', '['].indexOf(lastChar) === -1 &&
            !isVariableCharacter(lastChar))
            return setLastText(cursor);

          if (lastText !== '' &&
            isVariableCharacter(lastChar) &&
            hasSpace)
            return setLastText(cursor);

          inVariable = true;
          showSuggestions(val, cursor);

          return returnAcceptedInput(val);
        }

        if (input === '\b' && lastChar === '[') {
          inVariable = false;
          hideSuggestions();
        }

        if (input === '\b' && lastChar === ']') {
          inVariable = true;
          showSuggestions(val, cursor);
        }

        if (input === '.') {
          if (!isNumber(lastChar))
            return setLastText(cursor);

          //  avoid multiple '.' in numbers
          for (let i = cursor - 2; i >= 0; i--) {
            const ch = lastText[i];

            if (isNumber(ch))
              continue;

            if (ch === '.')
              return setLastText(cursor);

            break;
          }
        }

        if (isNumber(input) && lastText !== '') {
          if (isNumber(lastChar) && hasSpace)
            return setLastText(cursor);

          if (!inVariable && !isOperator(lastChar) && !isNumber(lastChar) && lastChar !== '(' && lastChar !== '' && lastChar !== '.')
            return setLastText(cursor);
        }

        if (inVariable && (isVariableCharacter(input) || isNumber(input) || input === '\b')) {
          showSuggestions(val, cursor);
        }

        returnAcceptedInput(val);
      }
      //not: değişti this.document.get(0).['selectedStart'] => e.target.selectionStart

      const text = expressionInput.val().toString(),
        textCursor: number = e.target.selectionStart ,
        lastInput = lastText.length > text.length ? '\b' : text[textCursor - 1];

      if (that.formulaOptions.preventWrongInput)
        forceCharInput(text, textCursor, lastInput);
      else {
        if (isVariableCharacter(lastInput)) {
          showSuggestions(text, textCursor);
        }

        lastText = text;
        validation();
      }
    }

    function setExpresionToInput(expression: string) {
      const exp = parseExpression(expression);

      lastText = exp;
      expressionInput.val(exp);
      validation();
    }

    function parseExpression(expression: string) {
      let exp = '',
        inVariable = false,
        _inString = false,
        stringText = '',
        varId = '',
        quote: string = '';

      for (let i = 0; i < expression.length; i++) {
        const input = expression[i];

        //  check string input
        if (['"', '\''].indexOf(input) > -1 && !_inString) {
          quote = input;
          _inString = true;
          continue;
        }

        if (input === quote && _inString) {
          exp += quote + stringText + quote;

          stringText = '';
          _inString = false;
          quote = '';
          continue;
        }

        if (_inString) {
          stringText += input;
          continue;
        }
        //  end of check string input

        if (input === '[') {
          inVariable = true;
          varId = '';
          continue;
        }

        if (input === ']' && inVariable) {
          const varName = getVariableById(parseInt(varId));

          if (varName) {
            if (isNumber(varName[0]))
              exp += '[' + varName + ']';
            else
              exp += varName;
          }
          else
            exp += '[var' + varId + ']';

          inVariable = false;
          continue;
        }

        if (inVariable) {
          varId += input;
          continue;
        }

        exp += input;
      }

      return exp;
    }

    function getVariableById(varId: number | string): string {
      for (let i = 0; i < that.formulaOptions.variables.length; i++)
        if (that.formulaOptions.variables[i].variableId.toString() === varId.toString())
          return that.formulaOptions.variables[i].name;

      return '';
    }

    function getVariable(varName: string) {
      for (let j = 0; j < that.formulaOptions.variables.length; j++)
        if (that.formulaOptions.variables[j].name === varName)
          return that.formulaOptions.variables[j];

      return undefined;
    }

    //  validations
    function isOperator(char) {
      return ['-', '+', '*', '/'].indexOf(char) >= 0;
    }

    function isInvalidCharacter(char) {
      return ['~', '!', '@', '#', '$', '%', '^', '&', '=', '{', '}', '<', '>', '|', '\\', '`', '\'', ';', ':'].indexOf(char) >= 0;
    }

    function isVariableCharacter(char) {
      if (char === '_')
        return true;

      if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z')
        return true;

      return true;
    }

    function isNumber(char) {
      return char >= '0' && char <= '9';
    }

    function validation() {

      const text = expressionInput.val().toString();

      const v = parser(text, parserOptions).validate();

      if (v === '') {
        notificaiton.parent().removeClass('invalid').addClass('valid');
        $('.create-telemetry-btn').removeAttr('disabled');
        notificaiton.removeAttr('title');
        return true;
      }

      notificaiton.parent().addClass('invalid').removeClass('valid');
      $('.create-telemetry-btn').attr('disabled', 'disabled');
      notificaiton.attr('title', v);
      return false;
    }

    function setCursorPosition(position: number) {
      expressionInput.get(0).setSelectionRange(position, position);
    }

    // Suggestions
    function hideSuggestions() {
      suggestions.empty().hide();
    }

    function showSuggestions(val: string, cursor: number) {

      let varName = '',
        startIndex = 0;

      for (let j = cursor; j > 0; j--) {
        const ch = val[j - 1];

        if (['[', '(', ' ', ')', ']', ','].indexOf(ch) > -1 ||
          isOperator(ch)) {
          startIndex = j;
          break;
        }

        varName = ch + varName;
      }

      let optionsHTML = '',
        isFirstItem = true;
      const items = Array<{ id: string, text: string }>()

      for (let l = 0; l < that.formulaOptions.variables.length; l++) {
        if (that.formulaOptions.variables[l].name.toLowerCase().indexOf(varName.toLowerCase()) > -1)
          items.push({ id: that.formulaOptions.variables[l].variableId, text: that.formulaOptions.variables[l].name });
      }

      let funcCount = 1;
      for (const f in that.formulaOptions.functions) {
        if (f.toString().toLowerCase().indexOf(varName.toLowerCase()) > -1) {
          let args = '';

          // read the function signature
          that.formulaOptions.functions[f].toString().replace(/(function\s*[(](?:\\[\s\S]|[^)])*[)])/, function (text, func) {
            if (args !== '')
              return;

            if (func)
              args = func.replace('function ', f);
          });
          items.push({ id: f + funcCount++, text: args });
        }
      }

      for (let i = 0; i < items.length; i++) {
        optionsHTML += '<div class="exp-suggestion-item"' + (isFirstItem ? 'selected' : '') +
          ' data-start=' + startIndex +
          ' data-current=' + cursor +
          ' data-id=' + items[i].id + ' >' + items[i].text + '</div>';

        isFirstItem = false;
      }

      if (optionsHTML !== '')
        suggestions.attr('data-index', 0).html(optionsHTML).slideDown();
      else
        hideSuggestions();
    }

    function selectVariable(div) {
      //not: değişti

      let text = expressionInput.val().toString();
      const start: number = parseInt($(div).attr('data-start') || '0') || 0,
        current: number = parseInt($(div).attr('data-current') || '0') || 0,
        tail = text.substr(current);

      const selectedText = $(div).text();

      if (isNumber(selectedText[0])) {
        if (text[start - 1] !== '[')
          text = text.substr(0, start) + '[' + selectedText + ']' + tail.trim();
        else
          text = text.substr(0, start) + selectedText + ']' + tail.trim();
      }
      else {
        if (text[start - 1] !== '[')
          text = text.substr(0, start) + selectedText + tail.trim();
        else
          text = text.substr(0, start - 1) + selectedText + tail.trim();
      }

      expressionInput.val(text);
      lastText = text;
      inVariable = false;
      hideSuggestions();

      for (let i = current; i < text.length; i++)
        if (text[i] === ']') {
          setCursorPosition(i + 2);
          break;
        }

      validation();
    }

    const s = {
      getExpression: function (): string {

        const p = parser(expressionInput.val(), parserOptions);
        const tree = p.getExpressionTree();

        if (tree === undefined)
          return '';

        return tree.toString(true);
      },

      setExpression: function (expression: string): void {
        setExpresionToInput(expression);
      },

      isValid: function (): boolean {
        return validation();
      },

      parseExpression: function (expression: string) {
        return parseExpression(expression);
      },

      getInput: function () {
        return expressionInput.val();
      },

      getVariableById: function (variableId: number) {
        return getVariableById(variableId);
      },

      setVariables: function (vars: Array<ExpressionBuilderVariable>) {
        that.formulaOptions.variables = vars || [];
      },

      runExpression: function () {
        const p = parser(expressionInput.val(), parserOptions);

        if (p.validate() !== '')
          return undefined;

        const tree = p.getExpressionTree();

        if (tree === undefined)
          return undefined;

        return tree.compute();
      }
    };

    return s;
  }

}








