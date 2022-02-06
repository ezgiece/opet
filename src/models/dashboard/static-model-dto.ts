
export class StaticModelDTO implements IEntity {
    NumberOfVehicles = 0;
    NumberOfVehiclesEnteringTheStation = 0;
    Rate = 0

    public static Create(): StaticModelDTO {
        const attributeFilter = new StaticModelDTO();
        return attributeFilter;
    }

}
