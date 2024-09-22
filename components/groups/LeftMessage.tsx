import React from "react";
import GlobalSearch from "../search/globalSearch";
import MessageBox from "../shared/groupAttribute/MessageBox";

const LeftMessage = () => {
  const box = [
    {
      id: "1",
      username: "Group ATSH",
      ava: "/assets/ava/ava1.jpg",
      content:
        "Hello I am Hello I am Hello I am Hello I am a girl in your life",
      sender: "You",
      pin: true,
      time: "4 min",
      isOnline: true,
      isSeen: true
    },
    {
      id: "2",
      username: "Team good boy",
      ava: "/assets/ava/ava2.jpg",
      content: "Hello",
      sender: "MasterD",
      pin: false,
      time: "4 min",
      isOnline: true,
      isSeen: true
    },
    {
      id: "3",
      username: "Team dev",
      ava: "/assets/ava/ava1.jpg",
      content: "Hello",
      sender: "Junnie",
      pin: false,
      time: "4 min",
      isOnline: false,
      isSeen: false
    }
  ];

  return (
    <div className="flex flex-col w-full h-screen py-[16px] px-[8px]">
      <div className="text-dark100_light900">
        <p className="h2-medium">Groups</p>
      </div>

      <GlobalSearch />

      <div className="mt-[12px] flex w-full flex-col overflow-y-auto overflow-x-hidden">
        {box.length > 0
          ? box.map((item) => (
              <MessageBox
                key={item.id}
                id={item.id}
                username={item.username}
                sender={item.sender}
                ava={item.ava}
                content={item.content}
                pin={item.pin}
                time={item.time}
                isOnline={item.isOnline}
                isSeen={item.isSeen}
              />
            ))
          : null}
      </div>

      <div></div>
    </div>
  );
};

export default LeftMessage;
