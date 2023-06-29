package razzle.ai.reference_apps.expense_manager;

/**
 * created by Julian Duru on 04/03/2023
 */
public class Employee {

  private String id;

  private String companyId;

  private String firstName;

  private String lastName;

  private String email;


  public Employee() {
  }

  public Employee(String id, String companyId, String firstName, String lastName, String email) {
    this.id = id;
    this.companyId = companyId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }


  public String id() {
    return id;
  }

  public Employee setId(String id) {
    this.id = id;
    return this;
  }

  public String companyId() {
    return companyId;
  }

  public Employee setCompanyId(String companyId) {
    this.companyId = companyId;
    return this;
  }

  public String firstName() {
    return firstName;
  }

  public Employee setFirstName(String firstName) {
    this.firstName = firstName;
    return this;
  }

  public String lastName() {
    return lastName;
  }

  public Employee setLastName(String lastName) {
    this.lastName = lastName;
    return this;
  }

  public String email() {
    return email;
  }

  public Employee setEmail(String email) {
    this.email = email;
    return this;
  }
}
