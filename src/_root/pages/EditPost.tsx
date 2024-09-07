import { useParams } from "react-router-dom"

import Loader from "@/components/shared/Loader";
import PostForm from "@/components/forms/PostForm"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";


const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');

  if(isPending) return (
    <div className="h-full w-full flex-center">
        <Loader />
    </div>
  ); 

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="w-full max-w-5xl flex-start justify-start gap-3">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full text-left">Edit Post</h2>
        </div>

        {isPending ? <Loader /> : <PostForm action="Update" post={post} />}
      </div>
    </div>
  );
};

export default EditPost;