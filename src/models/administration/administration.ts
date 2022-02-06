export class Administration implements IEntity {

    Id!: string;
    UserName!: string;
    Email!: string;
    OrganizationId!: string;
    //OrganizationName!: string;
    PhoneNumber!: string;
    Password!: string;
    //IsGodUSer!: boolean;
    PolicyId!: string;

    RolePolicyDatas: Array<PolicyRole> = [];

}

export class PolicyRole implements IEntity {
    roleId!: string;
    policyId!: string;
}