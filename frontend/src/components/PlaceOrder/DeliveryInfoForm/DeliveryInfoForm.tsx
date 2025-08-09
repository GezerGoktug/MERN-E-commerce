import { Controller, useFormContext } from "react-hook-form";
import styles from "./DeliveryInfoForm.module.scss";
import Input from "../../ui/Input/Input";
import { useEffect, useRef, useState } from "react";
import ErrorModal from "../ErrorModal/ErrorModal";
import { AnimatePresence } from "framer-motion";
import { IMaskInput } from "react-imask";
import Select from "react-select";

type CountryType = {
  country: string;
  city: string[];
};

const DeliveryInfoForm = () => {
  const form = useFormContext();
  const [modal, setModal] = useState(false);
  const [countries, setCountries] = useState<CountryType[]>([]);
  const firstMount = useRef(false);

  useEffect(() => {
    if (firstMount.current && !form.formState.isValid) {
      setModal(true);
    }
    firstMount.current = true;
  }, [form.formState.isSubmitting, form.formState.isValid]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const res = await fetch("/country.json");
      const dt = await res.json();
      setCountries(dt);
    };
    fetchCountriesData();
  }, []);

  const countriesOptions = countries.map((item) => ({
    value: item.country,
    label: item.country,
  }));

  const cityOptions = countries
    .find((item) => item.country === form.watch("country"))
    ?.city.map((item) => ({ value: item, label: item }));

  return (
    <div className={styles.delivery_info_form_wrapper}>
      <AnimatePresence>
        {modal && (
          <ErrorModal
            errors={form.formState.errors}
            closeModal={() => setModal(false)}
          />
        )}
      </AnimatePresence>
      <h6>
        DELIVERY
        <span>INFORMATION</span>
      </h6>
      <div className={styles.delivery_info_form}>
        <div className={styles.side_by_side_inputs}>
          <Controller
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <Input
                className={styles.delivery_form_input}
                fields={field}
                placeholder="First name"
              />
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <Input
                className={styles.delivery_form_input}
                fields={field}
                placeholder="Last name"
              />
            )}
          />
        </div>
        <Controller
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input
              className={styles.delivery_form_input}
              fields={field}
              placeholder="Email address"
              type="email"
            />
          )}
        />
        <Controller
          control={form.control}
          name="street"
          render={({ field }) => (
            <Input
              className={styles.delivery_form_input}
              fields={field}
              placeholder="Street"
            />
          )}
        />
        <div className={styles.side_by_side_inputs}>
          <Select
          
            placeholder="Select a city"
            className={styles.form_select}
            onChange={(e) => form.setValue("city", e?.value)}
            options={cityOptions}
          />

          <Select
            placeholder="Select a country"
            className={styles.form_select}
            onChange={(e) => form.setValue("country", e?.value)}
            options={countriesOptions}
          />
        </div>
        <div className={styles.side_by_side_inputs}>
          <Controller
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <Input
                className={styles.delivery_form_input}
                fields={field}
                placeholder="Zipcode"
              />
            )}
          />
          <Controller
            control={form.control}
            name="state"
            render={({ field }) => (
              <Input
                className={styles.delivery_form_input}
                fields={field}
                placeholder="State"
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <Input
              customInput={IMaskInput}
              mask="0 (000) 000 00 00"
              className={styles.delivery_form_input}
              fields={field}
              placeholder="Phone Number"
            />
          )}
        />
      </div>
    </div>
  );
};

export default DeliveryInfoForm;
