// 请求类型
export interface LikeDTO {
  /** 点赞对象类型：1-帖子，2-评论，3-回复 */
  targetType: 1 | 2 | 3;
  /** 被点赞对象的ID */
  targetId: string;
}