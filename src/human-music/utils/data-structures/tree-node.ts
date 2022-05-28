export class TreeNode<T> {
   readonly isLeaf: boolean
   readonly value: T
   private _children: TreeNode<T>[] = []

   static root(): TreeNode<any> {
      return new TreeNode(null, false)
   }

   constructor(value: T, isLeaf: boolean = false, children: TreeNode<T>[] = []) {
      this.value = value
      this.isLeaf = isLeaf
      this._children = children
   }

   public get children(): TreeNode<T>[] {
      return this._children
   }

   shuffle(): TreeNode<T> {
      this._children.map((child, _, array) => {
         this._children = array.shuffle()
         return child.shuffle()
      })
      return this
   }
}
