declare global {
    interface Array<T> {
        shuffle(): Array<T>
    }
}

// eslint-disable-next-line no-extend-native
Array.prototype.shuffle = function <T>(this: T[]) {
    return this.sort(() => Math.random() - 0.5)
}

export class TreeNode<T> {
    readonly value: T
    private _children: TreeNode<T>[] = []

    constructor(value: T) {
        this.value = value
    }

    public get children(): TreeNode<T>[] {
        return this._children
    }

    public get isLeaf(): boolean {
        return this.children.length === 0
    }

    node(node: TreeNode<T>): TreeNode<T> {
        this.children.push(node)
        return this;
    }

    filter(predicate: (value: T) => boolean): TreeNode<T> {
        this._children = this._children.filter(child => predicate(child.value))
        this._children = this._children.map(child => child.filter(predicate))
        return this;
    }

    shuffle(): TreeNode<T> {
        this._children = this._children.shuffle()
        this._children = this._children.map(child => child.shuffle())
        return this;
    }
}

