
export class UserDTO implements IEntity {

    Id: string;
    UserName: string;
    Password: string;
    Password2: string;
    IsAdmin: boolean;
    InsertedUser: string;
    UpdatedUser: string;
    DeletedUser: string;
    CorrelationId: string;

    public static Create(): UserDTO {
        const attributeFilter = new UserDTO();
        return attributeFilter;
    }
}
