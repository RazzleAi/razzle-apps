package razzle.ai.reference_apps.expense_manager;

/**
 * created by Julian Duru on 04/03/2023
 */
public class Company {

  private String id;

  private String name;

  public Company() {
  }

  public Company(String id, String name) {
    this.id = id;
    this.name = name;
  }

  public String id() {
    return id;
  }

  public Company setId(String id) {
    this.id = id;
    return this;
  }

  public String name() {
    return name;
  }

  public Company setName(String name) {
    this.name = name;
    return this;
  }


}
