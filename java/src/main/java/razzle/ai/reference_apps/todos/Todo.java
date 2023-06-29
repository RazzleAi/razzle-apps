package razzle.ai.reference_apps.todos;

/**
 * created by Julian Duru on 03/03/2023
 */
public class Todo {

  private String id;

  private String title;

  private String description;

  private boolean done;


  public String id() {
    return id;
  }

  public Todo setId(String id) {
    this.id = id;
    return this;
  }

  public String title() {
    return title;
  }

  public Todo setTitle(String title) {
    this.title = title;
    return this;
  }

  public String description() {
    return description;
  }

  public Todo setDescription(String description) {
    this.description = description;
    return this;
  }

  public boolean done() {
    return done;
  }

  public Todo setDone(boolean done) {
    this.done = done;
    return this;
  }
}
