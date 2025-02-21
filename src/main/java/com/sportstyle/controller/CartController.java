package com.sportstyle.controller;

import com.sportstyle.model.CartItem;
import com.sportstyle.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartItemRepository cartItemRepository;
    
    @GetMapping
    public List<CartItem> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return cartItemRepository.findByUserId(Long.parseLong(userDetails.getUsername()));
    }
    
    @PostMapping
    public ResponseEntity<CartItem> addToCart(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody CartItem cartItem
    ) {
        cartItem.setUserId(Long.parseLong(userDetails.getUsername()));
        return ResponseEntity.ok(cartItemRepository.save(cartItem));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItem(
        @PathVariable Long id,
        @RequestBody CartItem cartItem
    ) {
        return cartItemRepository.findById(id)
            .map(item -> {
                item.setQuantity(cartItem.getQuantity());
                return ResponseEntity.ok(cartItemRepository.save(item));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        cartItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
