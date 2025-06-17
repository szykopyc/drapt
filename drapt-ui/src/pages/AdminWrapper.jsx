import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TabNav from "../components/baseui/TabNav";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";

export default function AdminWrapper() {
  return (
    <MainBlock>
      <BeginText title={"User Administration"}>
      </BeginText>
        <TabNav
          tabs={[
              {label:"User Management", value:"management", to: `/admin/management`, keyShortcut:"m"},
              {label:"User Engagement", value:"engagement", to: `/admin/engagement`, keyShortcut:"e"},
          ]}
          initialTab={"management"}
        />
      <Outlet />
    </MainBlock>
  );
}