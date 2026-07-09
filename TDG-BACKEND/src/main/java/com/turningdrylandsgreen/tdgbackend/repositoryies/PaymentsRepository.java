package com.turningdrylandsgreen.tdgbackend.repositoryies;

import com.turningdrylandsgreen.tdgbackend.entities.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentsRepository extends JpaRepository<PaymentTransaction, Integer> {

    Optional<PaymentTransaction> findByCheckoutRequestId(String checkoutRequestId);
    Optional<PaymentTransaction> findByInvoiceNumber(String invoiceNumber);
}
