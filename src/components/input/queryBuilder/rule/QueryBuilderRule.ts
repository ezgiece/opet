import formValidation from '@/base/form-validation/form-validation';
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator';
import { QueryBuilderRuleDto } from '../QueryBuilderDtos';

@Component({
    props: {
        index: {
            type: Number,
            default: -1
        },
        dto: {
            type: QueryBuilderRuleDto,
            required: true
        }
    },
    components: {}
})

export default class QueryBuilderRule extends Vue {

    operators: any[];
    selectedOperation: any;
    operationValue: string = '';

    constructor() {
        super();
        this.operators = [
            {text: 'Equal', value: 'equal'},
            {text: 'Not Equal', value: 'notEqual'},
            {text: 'In', value: 'in'},
            {text: 'Not In', value: 'notIn'},
            {text: 'Contains', value: 'contains'},
            {text: 'Does Not Contain', value: 'doesNotContain'},
            {text: 'Less Than', value: 'lessThan'},
            {text: 'Less Than Inclusive', value: 'lessThanInclusive'},
            {text: 'Greater Than', value: 'greaterThan'},
            {text: 'Greater Than Inclusive', value: 'greaterThanInclusive'},
            {text: 'Starts With', value: 'startsWith'},
            {text: 'Divided X', value: 'DividedX'},
        ]

        this.selectedOperation = this.$props.dto.selectedOperation;
        this.operationValue = this.$props.dto.operationValue.toString();
    }

    mounted() {
        this.emitUpdate();
    }

    generateRequestJson() {
        return {
            fact: this.$props.dto.telemetryContainerId,
            operator: this.selectedOperation,
            value: !isNaN(Number(this.operationValue)) ? Number(this.operationValue) : this.operationValue
        }
    }

    generateDto(): QueryBuilderRuleDto {
        const ret = new QueryBuilderRuleDto(this.$props.dto.telemetryName, this.$props.dto.telemetryContainerId);
        ret.selectedOperation = this.selectedOperation;
        ret.operationValue = this.operationValue;
        return ret;
    }

    removeSelf() {
        this.$emit("remove", this.$props.index);
    }

    isValid(): boolean {
        return this.operationValue != '' && this.operationValue.length < 100;
    }

    @Watch("selectedOperation")
    @Watch("operationValue")
    emitUpdate() {
        this.$emit("updated");
    }

    data() {
        return{
            rules: formValidation.rules
        }
    }

}