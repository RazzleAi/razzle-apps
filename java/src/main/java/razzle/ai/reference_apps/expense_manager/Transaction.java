package razzle.ai.reference_apps.expense_manager;

/**
 * created by Julian Duru on 04/03/2023
 */
public class Transaction {

  private String id;

  private String cardId;

  private String companyId;

  private String employeeId;

  private Number amount;

  private String date;

  public Transaction() {
  }

  public Transaction(String id, String cardId, String companyId, String employeeId, Number amount, String date) {
    this.id = id;
    this.cardId = cardId;
    this.companyId = companyId;
    this.employeeId = employeeId;
    this.amount = amount;
    this.date = date;
  }

  public String id() {
    return id;
  }

  public Transaction setId(String id) {
    this.id = id;
    return this;
  }

  public String cardId() {
    return cardId;
  }

  public Transaction setCardId(String cardId) {
    this.cardId = cardId;
    return this;
  }

  public String companyId() {
    return companyId;
  }

  public Transaction setCompanyId(String companyId) {
    this.companyId = companyId;
    return this;
  }

  public String employeeId() {
    return employeeId;
  }

  public Transaction setEmployeeId(String employeeId) {
    this.employeeId = employeeId;
    return this;
  }

  public Number amount() {
    return amount;
  }

  public Transaction setAmount(Number amount) {
    this.amount = amount;
    return this;
  }

  public String date() {
    return date;
  }

  public Transaction setDate(String date) {
    this.date = date;
    return this;
  }


}
