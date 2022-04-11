import { TreeNode } from '../../utils/data-structures/TreeNote';
import { Chord } from "./music-models";
export const progressions_list: string[] = [
    "bIIIM IIm bIIM Im",
    "I7 V7 VIm9 IV7",
    "Im bIIIM bVIIM IVm",
    "Im bIIIM bVIM bVIIM",
    "Im bIIM bIIIM bIIM",
    "Im bIIM Im IIIm",
    "Im bVIIM bVIM bIIM",
    "Im bVIIM IVm Im",
    "Im bVIM Im bIIM",
    "II7 V9 I7 I7",
    "IIm bIIM Im bVIIM",
    "IIm bVIIM7 Im",
    "Im IIIm IVm VIm",
    "Im IIIm VIm Isus4",
    "Im IIIm VIm IVm",
    "Im IIM IIIm V6",
    "Im Im IVm IIIm",
    "IIIm VIm IVm Im",
    "IIm IVm Vm Vm",
    "IIm7 V7 IIIm7 VIm7 IIm7 V7",
    "Im IVm bIIIM bVIM",
    "Im IVm bVIIM IVm",
    "IIm Vm Im Im",
    "IIm Vm Im IVm",
    "Im IVm IIm Vm",
    "Im IVm Isus2 IVm",
    "Im IVm Vm bVIIM",
    "Im IVm VIm Vm",
    "Im IVm Vm Vm",
    "Im Vm bVIIM IVm",
    "IVm Im IIIm IVm",
    "Im VIm IIm IVm",
    "IVm Im IIm VIm",
    "Im VIm IIm Vm",
    "Im VIm Im IVm",
    "Im VIm IVm IIIm",
    "Im Vm Im IVm",
    "Im VIm IVm Vm",
    "IVm IVm Im Vm",
    "Im Vm IVm VIm",
    "IVm Im Vm VIm",
    "IVm VIm IIIm Im",
    "Im Vm VIm IIIm IVm Im IVm Vm",
    "Im Vm VIm IIIm IVm",
    "Im Vm VIm IIm",
    "Im Vm VIm IVm",
    "Im Vm VIm Vm",
    "VIm bVIM bVIIM Im",
    "VIm IVm Im Vm",
    "VIm VIIm Vm VIm #IVo Vm",
    "Vm Im VIm Vm",
    "VIm Vm IVm Vm IIm Vm Im Im",
    "VIm Vm IVm Vm",
    "Vm IVm VIm Im",
    "Vm VIm IVm Im",
    "Im7 VIm III7 VII6 Im Im7 III7 IVm7",
    "Im bVIIM bVIM bVIIM",
    "Im bVIIM VIm bIIm",
    "II7 Vm9 Im7",
    "Im IIIm IVm VIm",
    "Im IIIm VII VIm",
    "Im IIm Vm Im",
    "Im IVm IIIm VIm",
    "IIm VIm Im IVm",
    "IIm Vm Im Im",
    "IIm Vm Im IVm",
    "Im IVm VII Im",
    "Im IVm VII Vm Im Im IIm Vm",
    "Im IVm Vm IVm",
    "Im IVm VIm Vm",
    "Im IVm Vm Vm",
    "Im VIm bIm Vm",
    "Im VIm IIIm bIIm",
    "Im VIm IIIm VII Im VI69 III7 VII",
    "Im VIm IIIm VII",
    "IVm IIIm VII Im",
    "Im VII Im Vm IIIm VII Im Vm Im",
    "Im VII Im Vm",
    //"IVm IIIm Vmsus4 VIm IVm Im IIIm VIm",
    "Im VII VIm IIIm IVm VIm VII Im",
    "Im VII VIm IIIm",
    "Im VIm IVm IIIm",
    "Im VIm IVm IIm",
    "Im VII VIm VII",
    "Im VIm IVm Vm",
    "Im VIm VII VII",
    "Im VIm VII Vm",
    "Im Vm IVm VII",
    "IVm Im Vm VIm",
    "IVm VIm VII Im",
    "IVm Vm VIm VII",
    "VIm bVI Im VII",
    "VII IVm VII Im",
    "VII IVm Vm Im",
    "VIm Im Vm IIIm",
    "VIm IVm Im Vm",
    "Vm Im IVm VII",
    "VIm Im Vm Vm",
    "VIm VII Im IIIm",
    "Vm IVm Im Im",
    "VIm VII Vm IIIm",
    "VIm VIm Im VII",
    "VIm VIm Im VII",
    "Vm VIm IIIm Im",
    "Vm VIm Vm Im"
]

export function convertToTree(progressions: string[]): TreeNode<Chord> {
    const root: TreeNode<Chord> = new TreeNode<Chord>(new Chord([0], "root"), false);
    let filteredProgressions = removeDuplicates(progressions);
    filteredProgressions.forEach(progression => {
        let currentNode = root;
        progression.split(" ").map((chord, index, array) => chord.node(index === array.length - 1))
            .forEach(chord => {
                const label = chord.value.label;
                const next = currentNode.children.find(child => child.value.label === label && !child.isLeaf);
                if (next && !chord.isLeaf) {
                    currentNode = next;
                } else {
                    currentNode.children.push(chord);
                    currentNode = chord;
                }
            });
    })
    console.log(filteredProgressions.length)
    console.log(root.count(child => child.isLeaf))
    return root;
}

function removeDuplicates(array: string[]) {
    return array.filter((value, index, self) => self.indexOf(value) === index);
}
