import { ReactNode } from "react";

export interface SpotlightResult {
  id: string | number;
  icon: ReactNode;
  title: string;
  description: string;
  path?: string;
}

export interface CommandData {
  icon?: string;
  description?: string;
  [key: string]: unknown;
}

export interface SelectedFeature {
  icon: ReactNode;
  name: string;
  path?: string;
  contentType?: string;
} 