import PostForm from "./PostForm";
const CreatePost = ({
  setIsCreate
}: {
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return <PostForm onFinish={() => setIsCreate(false)} />;
};
export default CreatePost;
