package razzle.ai.reference_apps.expense_manager;

/**
 * created by Julian Duru on 04/03/2023
 */
public class Card {

  private String id;

  private String employeeId;

  private String cardNumber;

  private boolean active;


  public Card() {
  }

  public Card(String id, String employeeId, String cardNumber, boolean active) {
    this.id = id;
    this.employeeId = employeeId;
    this.cardNumber = cardNumber;
    this.active = active;
  }

  public String id() {
    return id;
  }

  public Card setId(String id) {
    this.id = id;
    return this;
  }

  public String employeeId() {
    return employeeId;
  }

  public Card setEmployeeId(String employeeId) {
    this.employeeId = employeeId;
    return this;
  }

  public String cardNumber() {
    return cardNumber;
  }

  public Card setCardNumber(String cardNumber) {
    this.cardNumber = cardNumber;
    return this;
  }

  public boolean active() {
    return active;
  }

  public Card setActive(boolean active) {
    this.active = active;
    return this;
  }
}
