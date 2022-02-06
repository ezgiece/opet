export enum DataType {
    String = 1,
    Date = 2,
    Number = 3,
    Boolean = 4
}


export enum ClaimsType {
    card_number = "card_number",
    user_name = "user_name",
    full_name = "full_name",
    phone_number = "phone_number",
    email="email",
    organization_id="organization_id"
}

export enum FilterOperator {
    Equals = 1,
    NotEquals = 2,
    Greater = 3,
    GreaterOrEquals = 4,
    Less = 5,
    LessOrEqual = 6,
    Contains = 7,
    NotContains = 8,
    StartsWith = 9,
    EndsWith = 10
}

export enum AlertType {
    Success = 1,
    Warning = 2,
    Error = 3,
    Fatal = 4
}

export enum AssetTypeEnum {
    Gateway = 1,
    Sensor = 2,
    CustomAssetType = 3,
    Fatal = 4
}

export enum AssetOwnerTypeEnum {
    User = 1,
    Organization = 2,
    Customer = 3,
    Role = 5
}

export enum AttributeTypeEnum{
    System = 1,
    Custom = 2
}

export enum AttributeBehaviorTypeEnum {
    Text = 1,
    Number = 2,
    DateTime = 3,
    Double = 4,
    Lookup = 5,
    Map = 6,
    Boolean = 7
}

export enum AttributeColumnSettingsEnum {
    MaxValue = 1,
    MinValue = 2,
    Required = 3,
    //Regex = 4,
    MinLength = 5,
    MaxLength = 6
  }

export enum TelemetryTypeEnum {
    Raw = 0,
    Virtual = 1
}

export enum TimePeriodsTr {
    Saniye = 1,
    Dakika = 2,
    Saat = 3,
    Gün = 4,
    Hafta = 5,
    Ay = 6,
    Yıl = 7
}
export enum TimePeriodsEn {
    Second = 1,
    Minute = 2,
    Hour = 3,
    Day = 4,
    Week = 5,
    Month = 6,
    Year = 7
}

export enum MaintenanceTypeEnum {
    Tarih = 1,
    Sayac = 3,
    Tarih_Sayac=6,
}

export enum MaintenanceStatusTypeEnum {
    Acik = 1,
    Kapali = 2,
}
export enum PeriodTypeEnum{
    Shift=1,
    Day = 2,
    Week = 3,
    Month = 4,
    Year = 5,   
}

export enum DaysOfWeekEnum{
    Pazartesi=1,
    Sali = 2,
    Carsamba = 3,
    Persembe = 4, 
    Cuma=5,
}
export enum DateTypeEnum{
    Daily=0,
    Weekly=1,
    Monthly=2,
    Yearly=3,
    Shiftly=4,
}
export enum PeriodDetailKeyEnum{
    Weekly = "Weekly",
    MonthOfYear="MonthOfYear",
    DayOfCurrentMonthAndCurrentWeek="DayOfCurrentMonthAndCurrentWeek",
    DayOfCurrentWeek="DayOfCurrentWeek",
    DayOfMonth="DayOfMonth",
    Everyday="Everyday", 
    Weekday="Weekday",
    Shift="Shift",
}

export enum DailyPeriodSelectionTypeEnum
{
    ByNumberInput = 1,
    ByWeekdays = 2
}

export enum PermissionGroupImpactLevel
{
    User = "User",
    OnlyPolicyItself = "OnlyPolicyItself",
    PolicyItselfAndItsChildPolicies = "PolicyItselfAndItsChildPolicies",
    AllPoliciesIncludedInZone = "AllPoliciesIncludedInZone"
}
