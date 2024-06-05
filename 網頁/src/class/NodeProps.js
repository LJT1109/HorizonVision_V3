export default class NodeProps {
  constructor(
    index = 0,
    position = { x: 0, y: 0 },
    groupId = -1,
    head = true,
    hash = "",
    
    
  ) {
    this.index = index;
    this.position = position;
    this.prev = []; // 儲存接入的nodeconnector的index
    this.next = []; // 儲存接出的nodein的index
    this.groupId = groupId;
    this.head = head;
    this.content = "";
    this.hash = hash;
    
  }
}
export class TextNodeProps extends NodeProps {
  constructor({
    index = 0,
    position = { x: 0, y: 0 },
    groupId = -1,
    head = true,
    content = "請點擊以輸入文字內容",
    type = "text",
    prev = [], // 儲存接入的nodeconnector的index
    next = [] // 儲存接出的nodein的index
  }){
    super(index, position, groupId, head); // 調用父類的構造函數
    this.content = content; // 新增或覆蓋 content 屬性
    this.type = type;
    this.prev = prev;
    this.next = next;
  }

  /* 你也可以添加新的方法或覆蓋父類的方法
  someNewMethod() {
    // ...
  }
  */
}

export class ImageNodeProps extends NodeProps {
  constructor({
    index = 0,
    position = { x: 0, y: 0 },
    groupId = -1,
    head = true,
    content = "",
    type = "image",
    url = "",
    prev = [], // 儲存接入的nodeconnector的index
    next = [], // 儲存接出的nodein的index
    hash = ""

  }) {
    super(index, position, groupId, head, hash); // 調用父類的構造函數
    this.content = content; // 新增或覆蓋 content 屬性
    this.type = type;
    this.url = url;
    this.prev = prev;
    this.next = next;
    this.hash = hash;
  }

  /* 你也可以添加新的方法或覆蓋父類的方法
  someNewMethod() {
    // ...
  }
  */
}
export class VideoNodeProps extends NodeProps {
  constructor({
    index = 0,
    position = { x: 0, y: 0 },
    groupId = -1,
    head = true,
    content = "",
    type = "video",
    url = "",
    prev = [], // 儲存接入的nodeconnector的index
    next = [] // 儲存接出的nodein的index
  }) {
    super(index, position, groupId, head); // 調用父類的構造函數
    this.content = content; // 新增或覆蓋 content 屬性
    this.type = type;
    this.url = url;
    this.prev = prev;
    this.next = next;
  }

  /* 你也可以添加新的方法或覆蓋父類的方法
  someNewMethod() {
    // ...
  }
  */
}
