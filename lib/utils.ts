import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type FileMap = Record<string, string>;
interface FileNode {
  [key: string]: FileNode | null;
}
export type TreeViewElement = string | TreeViewElement[];
export function convertFilesToTreeItems(files: FileMap): TreeViewElement[] {
  const tree: FileNode = {};
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/");
    let current: FileNode = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as FileNode;
    }

    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  function convertNode(node: FileNode, name?: string): TreeViewElement {
    const entries = Object.entries(node);

    if (entries.length === 0) {
      return name || "";
    }

    const children: TreeViewElement[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        children.push(key);
      } else {
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}