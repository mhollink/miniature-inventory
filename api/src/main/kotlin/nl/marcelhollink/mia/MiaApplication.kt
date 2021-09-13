package nl.marcelhollink.mia

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MiaApplication

fun main(args: Array<String>) {
    runApplication<MiaApplication>(*args)
}
