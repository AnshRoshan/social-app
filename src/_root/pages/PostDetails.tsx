import { useParams, Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/PostStats';

import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
 } from '@/lib/react-query/queriesAndMutations';
import { multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import GridPostList from '@/components/shared/GridPostList';

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isPending } = useGetPostById(id || '');  
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = () => {
    deletePost({ postId: post?.id, imageId: post?.imageId, });
    navigate(-1);
  };

  return (
    <div className='post_details-container'>
      <div className="hidden w-full max-w-5xl md:flex">
      <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPending || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

            <div className='post_details-info'>
              <div className="w-full flex-between">
                <Link
                  to={`/profile/${post?.creator.$id}`}
                  className='flex items-center gap-3'>
                  <img
                    src={
                      post?.creator?.imageUrl ||
                      '/assets/icons/profile-placeholder.svg'
                    }
                    alt="creator"
                    className="h-8 w-8 rounded-full lg:h-12 lg:w-12"
                  />
                <div className="flex flex-col gap-1">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                    <div className="flex-center gap-2 text-light-3">
                      <p className="subtle-semibold lg:small-regular">
                        {multiFormatDateString(post?.$createdAt)}
                      </p>
                      -
                      <p className="subtle-semibold lg:small-regular">
                        {post?.location}
                      </p>
                    </div>
                </div>
              </Link>

                <div className='flex-center gap-4'>
                  <Link
                    to={`/update-post/${post?.$id}`}
                    className={`${user.id !== post?.creator.$id && 'hidden'}`}>
                    <img
                      src='/assets/icons/edit.svg'
                      width={24}
                      height={24}
                      alt='edit'
                    />
                  </Link>

                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`ghost_details-delete_btn ${
                      user.id !== post?.creator.$id && 'hidden'
                    }`}>
                    <img
                      src={'/assets/icons/delete.svg'}
                      alt='delete'
                      width={24}
                      height={24}
                    />
                  </Button>                  
                </div>
              </div>

              <hr className="w-full border border-dark-4/80" />

              <div className="small-medium lg:base-regular flex w-full flex-1 flex-col">
                <p>{post?.caption}</p>
                <ul className="mt-2 flex gap-1">
                    {post?.tags.map((tag: string) => (
                        <li
                          key={tag}
                          className="text-light-3">
                            #{tag}
                        </li>
                    ))}
                </ul>
            </div>

            <div className='w-full'>
              <PostStats post={post} userId={user.id} />                      
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="w-full border border-dark-4/80" />

        <h3 className="body-bold md:h3-bold my-10 w-full">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;