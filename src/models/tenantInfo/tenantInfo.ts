export class TenantInfo implements IEntity {

    companyName: string = '';
    tenantId: string = '';
    numberOfDevice: Number = 0;
    mqttPointOfAccess: string = '';
    httpPointOfAccess: string = '';
    mqttUsername: string = '';
    mqttPassword: string = '';
    cseId: string = '';
}
