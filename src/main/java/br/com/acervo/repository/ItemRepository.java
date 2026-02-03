package br.com.acervo.repository;

import br.com.acervo.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("select i from Item i join i.categorias c where lower(c) = lower(:categoria)")
    Page<Item> findByCategoria(@Param("categoria") String categoria, Pageable pageable);
}
