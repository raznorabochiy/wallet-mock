import { expect, test } from "@playwright/test";
import { installMockWallet } from "./../src/installMockWallet";
import { privateKeyToAccount } from "viem/accounts";
import { isHex } from "viem";
import { sepolia } from "viem/chains";

test.beforeEach(async ({ page }) => {
  await installMockWallet({
    page,
    account: privateKeyToAccount(
      isHex(process.env.PRIVATE_KEY) ? process.env.PRIVATE_KEY : "0x",
    ),
    defaultChain: sepolia,
    debug: true,
  });
});

test("Metamask Wallet Test Dapp", async ({ page }) => {
  const baseUrl = "https://metamask.github.io/test-dapp/";
  await page.goto(baseUrl);
  await page.getByRole("button", { name: "USE METAMASK" }).click();

  await expect(
    page.getByRole("heading", { name: "Active Provider" }),
  ).toBeVisible();
  await expect(page.getByText("Name: MetaMask")).toBeVisible();

  await page.locator("#personalSign").click();

  expect(await page.locator("#personalSignResult").innerText()).toEqual(
    "0xf95b3efc808585303e20573e960993cde30c7f5a0f1c25cfab0379d5a14311d17898199814c8ebe66ec80b2b11690f840bde539f862ff4f04468d2a40f15178a1b",
  );
});
