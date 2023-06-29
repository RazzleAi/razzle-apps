package razzle.ai.reference_apps.expense_manager;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * created by Julian Duru on 04/03/2023
 */
@Service
public class ExpenseManagerService {


    private List<Company> companies = List.of(
            new Company("1", "Razzle AI"),
            new Company("2", "Google"),
            new Company("3", "Facebook")
    );


    private List<Card> cards = List.of(
            new Card("1", "1", "259892852", true),
            new Card("2", "2", "743454789", true),
            new Card("3", "3", "582985984", true)
    );


    private List<Employee> employees = List.of(
        new Employee("1", "1", "Jeffery", "Archie", "jeff_arch_2894859895++@gmail.com"),
        new Employee("2", "2", "Femi", "Kolade", "femz_kollz_+5902985+@gmail.com"),
        new Employee("3", "2", "Adanna", "Ikpeazu", "add0ikp_+8309044+@gmail.com")
    );


    private List<Transaction> transactions = List.of(
        new Transaction("1", "1", "1", "1" , 100.00, "2021-03-04"),
        new Transaction("2", "3", "2", "2" , 200.00, "2021-03-03"),
        new Transaction("3", "2", "2", "3" , 260.00, "2021-03-03")
    );


    public List<Company> listCompanies() {
        return companies;
    }


    public Company getCompany(String id) {
        return companies.stream()
            .filter(company -> company.id().equals(id))
            .findFirst()
            .orElse(null);
    }


    public List<Employee> listEmployeesByCompany(String companyId) {
        return employees.stream()
            .filter(employee -> employee.companyId().equals(companyId))
            .toList();
    }


    public List<Card> listCardsByEmployee(String employeeId) {
        return cards.stream()
            .filter(card -> card.employeeId().equals(employeeId))
            .toList();
    }


    public List<Transaction> listTransactionsByEmployee(String employeeId) {
        return transactions.stream()
            .filter(transaction -> transaction.employeeId().equals(employeeId))
            .toList();
    }


    public List<Card> listCardsByCompany(String companyId) {
        return cards.stream()
            .filter(card -> listEmployeesByCompany(companyId).stream()
                .map(Employee::id)
                .toList()
                .contains(card.employeeId()))
            .toList();
    }


    public List<Transaction> listTransactionsByCompany(String companyId) {
        return transactions.stream()
            .filter(transaction -> transaction.companyId().equals(companyId))
            .toList();
    }


    public List<Transaction> listTransactionsByCard(String cardId) {
        return transactions.stream()
            .filter(transaction -> transaction.cardId().equals(cardId))
            .toList();
    }


    public Card deactivateCardByCardId(String cardId) {
        var card = cards.stream()
            .filter(c -> c.id().equals(cardId))
            .findFirst()
            .orElse(null);

        if (card != null) {
            card.setActive(false);
        }

        return card;
    }


    public Card deactivateCardByCardNumber(String cardNumber) {
        var card = cards.stream()
            .filter(c -> c.cardNumber().equals(cardNumber))
            .findFirst()
            .orElse(null);

        if (card != null) {
            card.setActive(false);
        }

        return card;
    }


}

