import { FileResponseDTO } from "@/lib/DTO/map";
import PreCreate from "./PreCreate";
import UploadFiles from "./UploadFiles";
import { useEffect, useState } from "react";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { handleCreatePost, handleEditPost } from "@/utils/postUtils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import ConfirmModal, {
  ConfirmModalProps
} from "@/components/friends/ConfirmModal";
import { PostResponseDTO } from "@/lib/DTO/post";
import { useRouter } from "next/navigation";

const PostForm = ({
  post,
  isEdit = false,
  onFinish
}: {
  post?: PostResponseDTO;
  isEdit?: boolean;
  onFinish: () => void;
}) => {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]); //New Files
  const [remainContents, setRemainContents] = useState<FileResponseDTO[]>([]);
  const [captionContent, setCaptionContent] = useState("");
  const [taggedUser, setTaggedUser] = useState<ShortUserResponseDTO[]>([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModalProps>({
    setConfirm: () => {},
    handleAction: () => {},
    name: "",
    action: ""
  });
  useEffect(() => {
    if (!post) return;
    setRemainContents(post.contents);
    setTaggedUser(post.tags);
    setCaptionContent(post.caption);
  }, [post]);
  const handleSubmit = async () => {
    if (post && isEdit && post._id) {
      await handleEditPost(
        post._id,
        captionContent,
        files,
        remainContents,
        taggedUser,
        onFinish
      );
    } else {
      await handleCreatePost(captionContent, files, taggedUser, onFinish);
    }
    onFinish();
  };

  const router = useRouter();
  const handleBack = () => {
    if (isEdit) {
      router.push(`/community`);
    } else {
      onFinish();
    }
  };
  const handleConfirmBack = () => {
    setIsConfirm(true);
    setConfirm({
      setConfirm: setIsConfirm,
      handleAction: handleBack,
      name: "your changes",
      action: "discard"
    });
  };

  return (
    <>
      <div className="modal-overlay-post">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <Button
            className="flex bg-transparent shadow-none p-2 border-none hover:bg-transparent h-10 w-10"
            onClick={handleConfirmBack}
          >
            <Icon
              icon="mingcute:close-fill"
              width={40}
              height={40}
              className="text-light-700"
            />
          </Button>
        </div>
        <div
          className={`w-full h-[555px] rounded-lg background-light900_dark200 flex flex-col items-center justify-between ${
            step === 0 ? "max-w-[512px]" : "max-w-[852px]"
          }`}
        >
          {/* Header */}
          <div
            className={`flex w-full h-[43px] items-center ${
              step === 0
                ? files.length === 0 && remainContents.length === 0
                  ? "justify-center"
                  : "justify-between"
                : "justify-between "
            } border-b border-light500_dark400 px-4`}
          >
            {step === 1 ? (
              // Nút Back khi ở bước PreCreate
              <button
                className="p-0 border-none shadow-none cursor-pointer"
                onClick={() => setStep(0)}
              >
                <Icon
                  icon="material-symbols:arrow-back-rounded"
                  width={16}
                  height={16}
                  className="text-dark100_light900 object-cover"
                />
              </button>
            ) : (
              <div></div>
            )}
            <h2 className="paragraph-bold text-dark100_light900">
              {step === 1
                ? isEdit
                  ? "Update post"
                  : "Create new post"
                : "Upload files"}
            </h2>

            {step === 0 ? (
              // Nút Next khi ở bước UploadFiles
              (files.length > 0 || remainContents.length > 0) && (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center bg-transparent text-primary-500 rounded-full body-semibold"
                >
                  Next
                </button>
              )
            ) : (
              // Nút Share khi ở bước PreCreate
              <button
                className="flex items-center justify-center bg-transparent text-primary-500 rounded-full body-semibold"
                onClick={handleSubmit}
              >
                {isEdit ? "Done" : "Share"}
              </button>
            )}
          </div>

          {/* Nội dung */}
          {step === 0 ? (
            isEdit ? (
              <UploadFiles
                files={files}
                setFiles={setFiles}
                remainContents={remainContents}
                setRemainContents={setRemainContents}
              />
            ) : (
              <UploadFiles files={files} setFiles={setFiles} />
            )
          ) : (
            <PreCreate
              files={files}
              captionContent={captionContent}
              taggedUser={taggedUser}
              remainContents={remainContents}
              setCaptionContent={setCaptionContent}
              setTaggedUser={setTaggedUser}
            />
          )}
        </div>
      </div>
      {isConfirm && <ConfirmModal confirm={confirm} />}
    </>
  );
};
export default PostForm;
