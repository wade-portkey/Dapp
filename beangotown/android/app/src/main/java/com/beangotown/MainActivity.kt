package com.beangotown

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.beangotown.component.SupportWebView
import com.beangotown.ui.theme.MyApplicationTheme

const val BEANGOTOWN_URL = "https://beangotown.com"

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApplicationTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WebViewWrapper(BEANGOTOWN_URL)
                }
            }
        }
    }
}

@Composable
fun WebViewWrapper(url: String) {
    AndroidView(factory = {
        SupportWebView(it, url)
    })
}