import { createSignal, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { ScreenHeader, VerticalScroll } from "@app/components";
import { t } from "@app/i18n";
import { accountService } from "@app/services";
import { accountsStore, Account, transactionsStore, Await } from "@app/stores";

import { Form } from "./Form";

export function EditAccountScreen() {
  const [editedAccount, setEditedAccount] = createSignal<Account>();
  const navigate = useNavigate();
  const routeParams = useParams();

  onMount(async () => {
    const { data: account} = await accountService.getById(routeParams.id);
    if (!account) {
      return navigate("/");
    }

    setEditedAccount(account);
  });

  return (
    <main>
      <ScreenHeader withGoBackButton title={t("EditAccountScreen.title")} />
      <VerticalScroll hasHeader hasBottomNavigation>
        <Await for={[accountsStore.accounts(), transactionsStore.transactions(), editedAccount()]}>
          <Form {...editedAccount()!} />
        </Await>
      </VerticalScroll>
    </main>
  );
}
