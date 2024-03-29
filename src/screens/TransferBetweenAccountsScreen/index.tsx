import { ScreenHeader, VerticalScroll } from "@app/components";
import { Await, accountsStore, transactionsStore } from "@app/stores";
import { Form } from "./Form";
import { t } from "@app/i18n";

export function TransferBetweenAccountsScreen() {
  return (
    <main>
      <ScreenHeader withGoBackButton title={t("TransferBetweenAccountsScreen.title")} />
      <VerticalScroll hasHeader hasBottomNavigation>
        <Await for={[transactionsStore.transactions(), accountsStore.accounts()]}>
          <Form />
        </Await>
      </VerticalScroll>
    </main>
  );
}
