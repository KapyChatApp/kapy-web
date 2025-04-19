"use client";
import AccountLayout from "@/components/account/AccountLayout";
import { useUserContext } from "@/context/UserContext";
import { getMyProfile } from "@/lib/data/mine/dataAdmin";
import { AccountData } from "@/types/account";
import { handleGetAllDetail } from "@/utils/accountUtils";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { setPostData, setAdminInfo, adminInfo, postData } = useUserContext();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;

      if (id.toString() === adminId) {
        await getMyProfile(setAdminInfo);
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (!adminInfo) return;
    handleGetAllDetail(
      id.toString(),
      adminInfo,
      setAccount,
      setPostData,
      setError
    );
  }, [adminInfo, id]);

  return (
    <section className="h-screen w-full py-[16px] pr-[16px]">
      <main className="flex w-full h-full overflow-x-auto custom-scrollbar background-light900_dark400  rounded-xl">
        <AccountLayout account={account} />
      </main>
    </section>
  );
};

export default page;
