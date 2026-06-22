import { ClassProvider, FactoryProvider, ResourceRef, Type } from "@angular/core";

interface ResourceStrategy<ResourceType, ResourceParams> {
    fetchData(): Promise<ResourceType>
}

export abstract class Resource<ResourceType, ParamsType = any> {
    readonly params!: () => ParamsType;
    readonly resource!: ResourceRef<ResourceType>;

}

export const resourceProviderCreation = <ResourceType = any, ParamsType = any>(resourceClass: Type<Resource<ResourceType, ParamsType>> | Function): ClassProvider | FactoryProvider => typeof resourceClass !== 'function' ? ({
    useClass: resourceClass,
    provide: Resource<ResourceType, ParamsType>,
}) : ({
    useFactory: resourceClass,
    provide: Resource<ResourceType, ParamsType>,
})