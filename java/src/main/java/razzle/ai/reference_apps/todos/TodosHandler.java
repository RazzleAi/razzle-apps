package razzle.ai.reference_apps.todos;

import org.springframework.stereotype.Component;
import razzle.ai.annotation.Action;
import razzle.ai.annotation.ActionParam;
import razzle.ai.api.widget.RazzleResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static razzle.ai.api.widget.RazzleResponse.table;
import static razzle.ai.api.widget.RazzleResponse.text;

/**
 * created by Julian Duru on 03/03/2023
 */
@Component
public class TodosHandler {


    private Map<String, Todo> todoMap = new HashMap<>();


    @Action(name = "addTodo", description = "Add a new Todo")
    public RazzleResponse addTodo(@ActionParam String title, @ActionParam String description) {
        var todo = new Todo()
            .setId(String.valueOf(todoMap.size() + 1))
            .setTitle(title)
            .setDescription(description)
            .setDone(false);

        todoMap.put(todo.id(), todo);

        return text("Todo added successfully");
    }


    @Action(name = "getTodos", description = "Get all Todos")
    public RazzleResponse getTodos() {
        var columns = List.of("Id", "Title", "Description", "Done");

        var todos = todoMap.values();
        var data = todos.stream()
            .map(todo -> new String[] {
                todo.id(),
                todo.title(),
                todo.description(),
                String.valueOf(todo.done())
            })
            .toArray(String[][]::new);

        return table(columns, data);
    }


    @Action(name = "markTodoAsDone", description = "Mark a Todo as done")
    public RazzleResponse markTodoAsDone(@ActionParam String id) {
        var todo = todoMap.get(id);
        if (todo == null) {
            return text("Todo not found");
        }

        todo.setDone(true);
        return text("Todo marked as done");
    }


    @Action(name = "deleteTodo", description = "Delete a Todo")
    public RazzleResponse deleteTodo(@ActionParam String id) {
        var todo = todoMap.get(id);
        if (todo == null) {
            return text("Todo not found");
        }

        todoMap.remove(id);
        return text("Todo deleted successfully");
    }


}


