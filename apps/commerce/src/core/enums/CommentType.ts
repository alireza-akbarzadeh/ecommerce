export enum CommentState {
  draft = 1,
  published,
  rejected,
}

export enum CommentsOrderType {
  newest = 'CreateDate desc',
  top = 'LikeCount desc',
  buyer = 'Buyer desc',
}

export enum CommentRecommendationType {
  recommended = 1084001,
  notRecommended = 1084002,
  notSure = 1084003,
}
