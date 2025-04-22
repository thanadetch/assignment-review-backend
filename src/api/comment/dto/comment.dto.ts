export class CreateCommentDTO {
  content: string;
  replyTo?: string;
  reviewId: string;
}