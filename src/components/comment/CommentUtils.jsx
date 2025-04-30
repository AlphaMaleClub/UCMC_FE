//  유틸리티 함수

export const countComments = (comments) => {
    return comments.reduce((acc, comment) => {
        return acc + 1 + (comment.children ? countComments(comment.children) : 0);
    }, 0);
};