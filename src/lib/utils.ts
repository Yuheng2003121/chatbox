import { FileCollection } from "@/components/codeView/FileExplorer"
import { TreeItem } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface TreeNode {
  [key: string]: TreeNode | null;
}
// export function convertFilesToTreeItems(files: FileCollection): TreeItem[] {
//   const tree: TreeNode = {};
//   const sortedPaths = Object.keys(files).sort();
//   for (const path of sortedPaths) {
//     const parts = path.split("/");
//     let currentNode = tree;
//     for (let i = 0; i < parts.length; i++) {
//       const part = parts[i];
//       if (!currentNode[part]) {
//         currentNode[part] = {};
//       }
//       currentNode = currentNode[part];
//     }

//     const fileName = parts[parts.length - 1];
//     currentNode[fileName] = null;
//   }

//   function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
//     const entries = Object.entries(node);
//     if (entries.length === 0) {
//       return name || "";
//     }

//     const children: TreeItem[] = entries.map(([key, value]) => {
//       if (value === null) {
//         return key;
//       } else {
//         // this is a folder
//         const subTree = convertNode(value, key);
//         if (Array.isArray(subTree)) {
//           return [key, ...subTree];
//         } else {
//           return [key, subTree];
//         }
//       }
//     });

//     return children;
//   }
//   const result = convertNode(tree);
//   return Array.isArray(result) ? result : [result];
// }

export function convertFilesToTreeItems(files: FileCollection): TreeItem[] {
  const tree: TreeNode = {};
  const sortedPaths = Object.keys(files).sort();

  // ✅ 修正：只遍历到 parts.length - 1（目录部分）
  for (const path of sortedPaths) {
    const parts = path.split("/");
    let currentNode = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!currentNode[part]) {
        currentNode[part] = {};
      }
      // 安全断言：我们知道它是 TreeNode（不是 null）
      currentNode = currentNode[part] as TreeNode;
    }

    // ✅ 最后一项是文件
    const fileName = parts[parts.length - 1];
    currentNode[fileName] = null;
  }

  // 递归转换
  function convertNode(node: TreeNode): TreeItem[] {
    return Object.entries(node).map(([key, value]) => {
      if (value === null) {
        return key; // 文件
      } else {
        const children = convertNode(value); // 子目录的子项（TreeItem[]）
        return [key, ...children]; // 目录：[name, ...子项]
      }
    });
  }

  return convertNode(tree);
}
