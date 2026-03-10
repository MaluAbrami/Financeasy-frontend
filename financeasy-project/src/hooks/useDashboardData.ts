import { useEffect, useState } from "react";
import { bankAccountService } from "@/services/BankAccountService";
import { cardService } from "@/services/CardService";
import { transactionService } from "@/services/TransactionService";
import { categoryService } from "@/services/CategoryService";
import { alertService } from "@/services/AlertService";

import type { GetAllBanksAccounts } from "@/models/bankAccount/GetAllBanksAccounts";
import type { GetAllCards } from "@/models/card/GetAllCards";
import type { GetAllTransactions } from "@/models/transaction/GetAllTransactions";
import type { GetAllCategories } from "@/models/category/GetAllCategories";
import type { GetAllAlerts } from "@/models/alert/GetAllAlerts";
import type { PaginationRequest } from "@/models/pagination/PaginationRequest";

export function useDashboardData() {

  const [accounts, setAccounts] = useState<GetAllBanksAccounts | null>(null);
  const [cards, setCards] = useState<GetAllCards | null>(null);
  const [categories, setCategories] = useState<GetAllCategories | null>(null);
  const [alerts, setAlerts] = useState<GetAllAlerts | null>(null);

  const [monthAlert, setMonthAlert] = useState(new Date().getMonth() + 1);
  const [yearAlert, setYearAlert] = useState(new Date().getFullYear());

  const accountsPageSize = 2;

  const defaultPagination: PaginationRequest = {
    page: 1,
    pageSize: 50,
    orderBy: "",
    direction: "Asc",
  };

  async function loadAccounts(page = 1) {

    const response = await bankAccountService.getAll({
      page,
      pageSize: accountsPageSize,
      orderBy: "Balance",
      direction: "Desc",
    });

    setAccounts(response);
  }

  async function loadCards() {

    const response = await cardService.getAll({
      ...defaultPagination,
      pageSize: 2,
      orderBy: "CreditLimit",
      direction: "Desc",
    });

    setCards(response);
  }

  async function loadCategories() {

    const response = await categoryService.getAll({
      ...defaultPagination,
      orderBy: "Name",
    });

    setCategories(response);
  }

  async function loadAlerts(month = monthAlert, year = yearAlert) {

    const response = await alertService.getAll(month, year, {
      ...defaultPagination,
      pageSize: 50,
    });

    setAlerts(response);
  }

  useEffect(() => {

    loadAccounts(1);
    loadCards();
    loadCategories();

  }, []);

  useEffect(() => {
    loadAlerts(monthAlert, yearAlert);
  }, [monthAlert, yearAlert]);

  return {

    accounts,
    cards,
    categories,
    alerts,

    monthAlert,
    yearAlert,
    setMonthAlert,
    setYearAlert,

    loadAccounts,
  };
}