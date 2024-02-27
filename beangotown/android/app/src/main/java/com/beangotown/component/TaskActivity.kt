package com.beangotown.component

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.beangotown.BEANGOTOWN_URL
import com.beangotown.WebViewWrapper
import com.beangotown.ui.theme.MyApplicationTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class TaskActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val url = intent.getStringExtra(StorageIdentifiers.URL) ?: BEANGOTOWN_URL
        setContent {
            MyApplicationTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WebViewWrapper(url)
                }
            }
        }
    }

    private fun navigateBack(result: String, delayTime: Long = 200) {
        finish()
        CoroutineScope(Dispatchers.IO).launch {
            delay(delayTime)
            MessageBus.getCallback(intent.getStringExtra(StorageIdentifiers.CALLBACK_ID) ?: "")
                ?.invoke(result)
        }
    }
}

internal fun Context.forwardToTaskActivity(url: String) {
    val intent = Intent(this, TaskActivity::class.java)
    intent.putExtra(StorageIdentifiers.URL, url)
    intent.putExtra(StorageIdentifiers.CALLBACK_ID, "TaskActivity")
    startActivity(intent)
}
