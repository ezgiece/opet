export class QueryBuilderRuleDto {

    telemetryName: string;
    telemetryContainerId: string;
    selectedOperation: string;
    operationValue: string;

    constructor(telemetryName: string, telemetryContainerId: string) {
        this.telemetryName = telemetryName;
        this.telemetryContainerId = telemetryContainerId;
        this.selectedOperation = 'equal';
        this.operationValue = '';
    }
}

export class QueryBuilderGroupDto {

    selectedOperation: string;
    selectedTelemetry: any;
    childGroups: QueryBuilderGroupDto[];
    rules: QueryBuilderRuleDto[];

    constructor() {
        this.selectedOperation = 'ALL';
        this.selectedTelemetry = null;
        this.childGroups = [];
        this.rules = [];
    }

}