export interface PackageDependency {
  name: string;
  commit: string;
}

export interface BinaryDependency {
  name: string;
  version: string;
}

export interface DeviceComponent {
  url: string;
  name: string;
  pid: string;
  version: string;
  commit: string;
  packageDependencies: PackageDependency[];
  binaryDependencies: BinaryDependency[];
}

export interface CommonComponent {
  url: string;
  name: string;
  version: string;
  commit: string;
  dependencies: string[];
  files: string[];
}

export type Component = DeviceComponent | CommonComponent;

export interface Server {
  name: string;
  components: Component[];
}