import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface FileList {
  id: string
  fileDetails: FileDetail[]
}

export interface FileImage {
  id: string
  files: string[]
  filecount: string
  fileDetails: FileDetail[]
}

export interface FileDetail {
  extension: string
  filename: string
  id: string
  modified: string
  size: number
}
