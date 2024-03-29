import { Select } from "@app/components";
import { t } from "@app/i18n";
import { Field } from "solid-form-handler";
import { For } from "solid-js";
import { InputProps } from "../shared";

function generateWeekdayOptions() {
  const weekdays: { value: number, children: string}[] = [];
  for(let value = 1; value<= 7; value++) {
    weekdays.push({
      value,
      children: t(`long.weekdays.${value % 7}`, "Date")
    });
  }
  return weekdays;
}

type DaySelectProps = InputProps & {
  name: string;
}

export function DaySelect(props: DaySelectProps) {
  return (
    <Field
      mode="input"
      name={props.name}
      formHandler={props.formHandler}
      render={(field) => (
        <Select
          id="day"
          label={t("TaskFormFields.weekday")}
          errorMessage={field.helpers.errorMessage}
          {...field.props}
        >
          <For each={generateWeekdayOptions()}>
            {weekday => <option {...weekday} />}
          </For>
        </Select>
      )}
    />
  );
}
