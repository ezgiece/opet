import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator';
import { QueryBuilderGroupDto, QueryBuilderRuleDto } from '../QueryBuilderDtos';
import QueryBuilderRule from '../rule/QueryBuilderRule.vue';

@Component({
    props: {
        removable: {
            type: Boolean,
            default: true
        },
        telemetryList: {
            type: Array,
            required: true
        },
        index: {
            type: Number,
            default: -1
        },
        dto: {
            type: QueryBuilderGroupDto,
            required: true
        }
    },
    components: {
        QueryBuilderRule
    }
})

export default class QueryBuilderGroup extends Vue {

    logicOperators: any[];
    selectedOperation: string;
    selectedTelemetry: any;
    childGroups: QueryBuilderGroupDto[] = [];
    rules: QueryBuilderRuleDto[] = [];

    constructor() {
        super();
        this.logicOperators = [
            {text: 'AND', value: 'ALL'},
            {text: 'OR', value: 'ANY'}
        ]

        this.selectedOperation = this.$props.dto.selectedOperation;
        this.selectedTelemetry = this.$props.dto.selectedTelemetry;
        this.childGroups = this.$props.dto.childGroups;
        this.rules = this.$props.dto.rules; 
    }

    mounted() {
        this.emitUpdate();
    }

    @Watch('dto') 
    dtoUpdated() {
        this.selectedOperation = this.$props.dto.selectedOperation;
        this.selectedTelemetry = this.$props.dto.selectedTelemetry;
        this.childGroups = this.$props.dto.childGroups;
        this.rules = this.$props.dto.rules;
    }

    addGroup() {
        const newGroup = new QueryBuilderGroupDto();
        this.childGroups.push(newGroup);
    }

    addRule() {
        if(!this.selectedTelemetry) return;
        const newRule = new QueryBuilderRuleDto(this.selectedTelemetry.telemetryName, this.selectedTelemetry.containerId);
        this.rules.push(newRule);
    }

    generateRequestJson() {
        const jsonArray = [];
        for(let i = 0; i < this.childGroups.length; i++) {
            const groupComp: any = this.$refs['groupComponent' + i][0];
            jsonArray.push(groupComp.generateRequestJson());
        }
        for(let i = 0; i < this.rules.length; i++) {
            const ruleComp: any = this.$refs['ruleComponent' + i][0];
            jsonArray.push(ruleComp.generateRequestJson());
        }

        if(this.selectedOperation == "ANY") {
            return {
                "any": jsonArray
            }
        }
        else {
            return {
                "all": jsonArray
            }
        }
    }

    generateDto(): QueryBuilderGroupDto {
        const ret = new QueryBuilderGroupDto();
        ret.selectedOperation = this.selectedOperation;
        ret.selectedTelemetry = this.selectedTelemetry;
        ret.rules = [];
        for(let i = 0; i < this.rules.length; i++) {
            const ruleComp: any = this.$refs['ruleComponent' + i][0];
            ret.rules.push(ruleComp.generateDto());
        }
        ret.childGroups = [];
        for(let i = 0; i < this.childGroups.length; i++) {
            const groupComp: any = this.$refs['groupComponent' + i][0];
            ret.rules.push(groupComp.generateDto());
        }
        return ret;
    }

    removeSelf() {
        this.$emit("remove", this.$props.index);
    }

    reset() {
        this.rules = [];
        this.childGroups = [];
        this.selectedTelemetry = null;
    }

    async isValid(): Promise<boolean> {
        if(!this.selectedTelemetry) return false;

        await this.waitForChildRender();

        if(this.rules.length + this.childGroups.length == 0) return false;
        
        for(let i = 0; i < this.rules.length; i++) {
            const ruleComp: any = this.$refs['ruleComponent' + i][0];
            if(!ruleComp.isValid()) {
                return false;
            }
        }

        for(let i = 0; i < this.childGroups.length; i++) {
            const groupComp: any = this.$refs['groupComponent' + i][0];
            if(!groupComp.isValid()) {
                return false;
            }
        }

        return true;
    }

    removeGroup(index: number) {
        if(index >= this.childGroups.length) {
            return;
        }

        const newGroups: QueryBuilderGroupDto[] = [];
        for(let i = 0; i < this.childGroups.length; i++) {
            if(i == index) continue;
            const groupComp: any = this.$refs['groupComponent' + i][0];
            newGroups.push(groupComp.generateDto())
        }
        this.setChildGroups(newGroups);
        this.emitUpdate();
    }

    removeRule(index: number) {
        if(index >= this.rules.length) {
            return;
        }

        const newRules: QueryBuilderRuleDto[] = [];
        for(let i = 0; i < this.rules.length; i++) {
            if(i == index) continue;
            const ruleComp: any = this.$refs['ruleComponent' + i][0];
            newRules.push(ruleComp.generateDto())
        }
        this.setRules(newRules);
        this.emitUpdate();
    }

    setRules(newRules: QueryBuilderRuleDto[]) {
        this.rules = [];
        for(let i = 0; i < newRules.length; i++) {
            this.rules.push(newRules[i]);
        }
        for(let i = 0; i < this.rules.length; i++) {
            const ruleComp: any = this.$refs['ruleComponent' + i][0];
            ruleComp.selectedOperation = newRules[i].selectedOperation;
            ruleComp.operationValue = newRules[i].operationValue;
        }
    }

    setChildGroups(newGroups: QueryBuilderGroupDto[]) {
        this.childGroups = [];
        for(let i = 0; i < newGroups.length; i++) {
            this.childGroups.push(newGroups[i]);
        }
        for(let i = 0; i < this.childGroups.length; i++) {
            const groupComp: any = this.$refs['groupComponent' + i][0];
            groupComp.selectedOperation = newGroups[i].selectedOperation;
            groupComp.selectedTelemetry = newGroups[i].selectedTelemetry;
            groupComp.setChildGroups(newGroups[i].childGroups);
            groupComp.setRules(newGroups[i].rules);
        }
    }

    async waitForChildRender() {
        while(this.childGroups.length > 0 && this.$refs['groupComponent0'] == undefined) {
            await new Promise(r => setTimeout(r, 250));
        }
        while(this.rules.length > 0 && this.$refs['ruleComponent0'] == undefined) {
            await new Promise(r => setTimeout(r, 250));
        }
    }

    @Watch("selectedTelemetry")
    async selectedTelemetryChange() {
        if(this.selectedTelemetry == null) return;
        await this.waitForChildRender();
        if(this.rules.length != 0) {
            const newRules: QueryBuilderRuleDto[] = [];
            for(let i = 0; i < this.rules.length; i++) {
                const ruleComp: any = this.$refs['ruleComponent' + i][0];
                const dto: QueryBuilderRuleDto = ruleComp.generateDto();
                dto.telemetryName = this.selectedTelemetry.telemetryName;
                dto.telemetryContainerId = this.selectedTelemetry.containerId;
                newRules.push(dto);
            }
            this.setRules(newRules);
        }
        this.emitUpdate();
    }


    @Watch("selectedOperation")
    emitUpdate() {
        this.$emit("updated");
    }

}