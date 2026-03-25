-- AlterTable: add WeChat fields to User
ALTER TABLE "User"
  ADD COLUMN "wechatOpenId" TEXT,
  ADD COLUMN "wechatName"   TEXT;

-- CreateIndex: unique WeChat openId per user
CREATE UNIQUE INDEX "User_wechatOpenId_key" ON "User"("wechatOpenId");

-- AlterTable: add age, gender, and WeChat fields to Registration
ALTER TABLE "Registration"
  ADD COLUMN "age"          INTEGER,
  ADD COLUMN "gender"       TEXT,
  ADD COLUMN "wechatName"   TEXT,
  ADD COLUMN "wechatOpenId" TEXT;
