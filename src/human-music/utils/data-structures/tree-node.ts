export class TreeNode<T> {
   readonly isLeaf: boolean
   readonly value: T
   private _children: TreeNode<T>[] = []

   static root(): TreeNode<any> {
      return new TreeNode(null, true)
   }

   constructor(value: T, isLeaf: boolean = false, children: TreeNode<T>[] = []) {
      this.value = value
      this.isLeaf = isLeaf
      this._children = children
   }

   public get children(): TreeNode<T>[] {
      return this._children
   }

   add(node: TreeNode<T>): TreeNode<T> {
      this.children.push(node)
      return this
   }

   hasDirectChild(value: T): boolean {
      return this.children.map((child) => child.value).includes(value)
   }

   count(predicate: (child: TreeNode<T>) => boolean): number {
      return this._children.reduce((count, child) => count + child.count(predicate), predicate(this) ? 1 : 0)
   }

   filter(predicate: (value: T) => boolean): TreeNode<T> {
      this._children.map((child, _, array) => {
         this._children = array.filter((element) => predicate(element.value))
         return child.filter(predicate)
      })
      return this
   }

   shuffle(): TreeNode<T> {
      this._children.map((child, _, array) => {
         this._children = array.shuffle()
         return child.shuffle()
      })
      return this
   }
}
