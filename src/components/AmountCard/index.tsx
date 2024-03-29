import { createMemo } from "solid-js";
import { FaSolidArrowTrendDown, FaSolidArrowTrendUp } from "solid-icons/fa";
import type { CurrencyCode } from "@app/entities";
import { Message } from "@app/i18n";
import { TransactionType } from "@app/stores";
import { currencyService } from "@app/services";
import "./style.css";

export type AmountCardContentProps = {
  amount: number | null;
  currency: CurrencyCode;
  type: TransactionType;
}

export function AmountCard(props: AmountCardContentProps) {
  const renderIcon = createMemo(() => {
    return {
      income: <FaSolidArrowTrendUp class="amount-card-icon" size={20} />,
      expense: <FaSolidArrowTrendDown class="amount-card-icon" size={20} />
    }[props.type];
  });

  const formattedAmount = createMemo(() => {
    if (props.amount == null) {
      return "";
    }
    return currencyService.formatValue(props.currency, props.amount);
  });

  return (
    <div class={`amount-card ${props.type}`}>
      <div>
        <div class="text-xs font-medium">
          <Message>{`common.${props.type}`}</Message>
        </div>
        <div class="mt-1 font-bold text-lg">
          {formattedAmount()}
        </div>
      </div>
      <div class="mt-1 pr-3">{renderIcon()}</div>
    </div>
  );
}