package com.beangotown.component

object MessageBus {
    private val map: MutableMap<String, (String) -> Unit> = mutableMapOf()
    fun registerCallback(key: String, callback: (String) -> Unit) {
        map[key] = callback
    }

    fun unregisterCallback(key: String) {
        map.remove(key)
    }
    fun getCallback(key: String): ((String) -> Unit)? {
        return map[key]
    }
}

internal fun generateUniqueID(): String {
    return System.currentTimeMillis().toString() + Math.random().toString()
}