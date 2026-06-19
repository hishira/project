import { ResourceRef } from "@angular/core";

interface ResourceStrategy<ResourceType, ResourceParams>{
    fetchData(): Promise<ResourceType>
}

export abstract class Resource<ResourceType> {
    readonly resource!: ResourceRef<ResourceType>;
}